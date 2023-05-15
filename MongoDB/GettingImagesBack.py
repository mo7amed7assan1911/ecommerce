from pymongo import MongoClient
from bson.binary import Binary
from PIL import Image
import io
import matplotlib.pyplot as plt
import os
import random
client = MongoClient("mongodb+srv://mmymm:PrayForPalestine@ecomcluster.dfqnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.eCom

rn = random.randrange(1, 990)
document = db.items.find()

pil_img = Image.open(io.BytesIO(document[rn]['image']))
plt.imshow(pil_img)
plt.show()
h = os.getcwd()
print('>', h)
