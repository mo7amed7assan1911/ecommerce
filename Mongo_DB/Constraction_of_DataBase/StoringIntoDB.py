"""
Notice the data ara already stored in the database.
You can test the data scrapped in gatheringData.py file.
"""
import pymongo
from gatheringData import Getting_Data as gd 

mens_bags = 'https://www.jumia.com.eg/bags/?page='       

Beauty_health = 'https://www.jumia.com.eg/body-skin-care/?page='        

labtops = 'https://www.jumia.com.eg/laptops/?page='       

Smart_phones = 'https://www.jumia.com.eg/smartphones/?page='    

babies = 'https://www.jumia.com.eg/mlp-free-shipping/baby-products/?page='  


# data of the baby products.
Baby_products = gd(babies)

# data of the smart phones.
SmartPhones_products = gd(Smart_phones)

# data of the Beauty and helthe products.
BeautyHealth_products = gd(Beauty_health)

# data of the labtops.
Labtops_products = gd(labtops)

# data of the mens bags.
MensBagsProducts = gd(mens_bags)



# Connecting to our cluster.
client = pymongo.MongoClient("mongodb+srv://mmymm:PrayForPalestine@ecomcluster.dfqnc.mongodb.net/eCom?retryWrites=true&w=majority")

# Notice
# ecom is Our actual data base we used in the project .. for safe we will use another data base if we need to check code.
db = client.eCom 


# db = client.Test   # just for safe not to duplicate the products.
print(db.items.insert_many(Baby_products))
print(db.items.insert_many(SmartPhones_products))
print(db.items.insert_many(BeautyHealth_products))
print(db.items.insert_many(Labtops_products))
print(db.items.insert_many(MensBagsProducts))

