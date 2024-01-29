from sentence_transformers import SentenceTransformer, util
import sys
import json
import torch

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
param1 = sys.argv[1]
param2 = sys.argv[2]
param3 = sys.argv[3]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

''' 
delimiters = [",", "[", "]"]
 
for delimiter in delimiters:
    param1 = " ".join(param1.split(delimiter))
 
param1_list = param1.split()
for i in range(len(param1_list)):
    param1_list[i] = float(param1_list[i])
'''   
param1_list = param1.split("],[")

vector_list = []
for i in range(len(param1_list)):
    delimiters = [",", "[", "]"]
 
    for delimiter in delimiters:
        param1_list[i] = " ".join(param1_list[i].split(delimiter))
    
    data_list = param1_list[i].split()
    for j in range(len(data_list)):
        data_list[j] = float(data_list[j])
    #print(type(data_list[383]))
    #print('hahaha')
    tensor_data = torch.FloatTensor(data_list).to(device)
    #print(tensor_data.shape)
    vector_list.append(tensor_data)


#Compute embedding for all sentence, to build up a dictionary for further search
#in our application, we can embed the sentence as the document been uploaded
vector = (model.encode(param3, convert_to_tensor=True))

scores = [0, 0, 0, 0, 0]
indexs = [0, 0, 0, 0, 0]
score_1 = 0
index_1 = 0
score_2 = 0
index_2 = 0
#compare the wanted query with all the other embedding in the dictionar
for i in range(len(vector_list)):
    score = (util.pytorch_cos_sim(vector, vector_list[i]))
    if score >= score_1:
        score_2 = score_1
        index_2 = index_1
        index_1 = i
        score_1 = score
    elif score >= score_2:
        index_2 = i
        score_2 = score
        

#print(highest_score)
param2 = param2.split(",")
print(param2[index_1], param2[index_2]) #convert tensor -> list -> json string
sys.stdout.flush() # remeber to call this. or nothing will be passed to JS
    