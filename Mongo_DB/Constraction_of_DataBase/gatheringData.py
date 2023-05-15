import requests
from bs4 import BeautifulSoup
import os
from PIL import Image
import io


babies = 'https://www.jumia.com.eg/mlp-free-shipping/baby-products/?page='  


def Getting_Data(url):
    
    print(f"\n{'*' * 10}  Products of {url.split('/')[-2]}  {'*' * 10}\n")
    # Making a folder to save images
    folder_name = 'Images'
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
    li = []
        
        
    for i in range(1, 6):   # getting data from 5 pages of each type of products.
        response = requests.get(url + str(i))
        soup = BeautifulSoup(response.content, 'lxml')
        data = soup.find('div', {'class': '-paxs row _no-g _4cl-3cm-shs'})
        products = data.find_all('article', {'class': 'prd _fb col c-prd'})
        
        x = 0
        for pr in products: 
        
            title = pr.find('a').find('div', {'class': 'info'}).find('h3').text
            imgLink   = pr.find('a').find('div', {'class': 'img-c'}).find('img', {'class': 'img'})['data-src']
            price = float(pr.find('a').find('div', {'class': 'info'}).find('div', {'class': 'prc'}).text.split()[1].replace(',', ''))
            brand = pr.find('a')['data-brand']
            tags  = pr.find('a')['data-category'].split('/')
            
            img_data = requests.get(imgLink).content
            try:
                
                # path of saving the photos
                path_ = r"{}.jpg".format(os.path.join(folder_name, f"{title.split('-')[0].strip().split('/')[0]}")) 
                print('>>>>', path_.split('\\')[1][:-4])
                
                # saving photos in the last path.
                with open(path_, mode='wb') as handler:
                    handler.write(img_data)
                            
                # converting photos to bytes to save it in mongodb.
                im = Image.open(path_) 
                image_bytes = io.BytesIO()
                im.save(image_bytes, format='JPEG')
                li.append(
                    {
                        'title': title,
                        'amount': 5,
                        'price': price,
                        'brand': brand,
                        'image': image_bytes.getvalue(),
                        'category': tags[0],
                        'tags': tags,
                        'total_rate': 0,
                        'count_of_ratings': 0,
                        'reviews': []
                    }
            )
            except:   # if there are any not allowed symbol in the title to use in the path. 
                continue 

            # # if we need to add the original scrapped ratings.
            # rating = float(pr.find('a').find('div', {'class': 'info'}).find('div', {'class': 'rev'}).text.split()[0])
            # no_of_rev  = int(pr.find('a').find('div', {'class': 'info'}).find('div', {'class': 'rev'}).text.split()[-1][2:4])
    print('=' * 50)
    return li

def testing():
    # data of the baby products
    Baby_products = Getting_Data(babies)
    
    print('\n\nDone', '\n\n', Baby_products[4],'\n\n')
if __name__ == "__main__":
    testing()
    