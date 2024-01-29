from sentence_transformers import SentenceTransformer
import sys
import json


param = sys.argv[1]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
#Compute embedding for all sentence, to build up a dictionary for further search
#in our application, we can embed the sentence as the document been uploaded
vector = (model.encode(param, convert_to_tensor=True))

print(json.dumps(vector.tolist())) #convert tensor -> list -> json string
sys.stdout.flush() # remeber to call this. or nothing will be passed to JS
    