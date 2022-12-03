
import pickle
import pandas as pd
import numpy as np
from tqdm import tqdm
from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
import re
import torch
from keras_preprocessing.sequence import pad_sequences
import time
import datetime


class LocalitySensitiveHashing:
    
    def __init__(self,n_planes,plane_dimensions,n_iterations):
        
        self.n=n_planes
        self.d=plane_dimensions
        self.n_iterations=n_iterations
        self.dic=[]
        self.planes=[]
    def Random_planes(self,n,d):
        
        return np.random.normal(size=(n,d))
    
    
    def fit(self,data):
        
        y_train=data[:,1:]
        #no of iterations
        for i in tqdm(range(self.n_iterations)):
            #generating Random planes
            random=self.Random_planes(self.n, self.d)
            #dot product
            a=np.dot(y_train,random.T)
            #bins
            h=np.where(a>1,1,0)
            #append random planes
            self.planes.append(random)
            #inserting bins into dictionary
            new_dic=defaultdict(list)
            for i in range(len(h)):
              new_dic[str(h[i])].append(data[i,0])
            self.dic.append(new_dic)
    
    def add_point(self,points,index):
       for i in range(len(points)):
           for j in range(len(self.planes)):
                dot=np.dot(points[i],self.planes[j].T)
                dot=np.where(dot>1,1,0)
                self.dic[j][str(dot)].append(index[i,0])
   
    
    def fetch(self,point):
        buckets=set()
        for i in range(len(self.planes)):
          dot=np.dot(point,self.planes[i].T)
          dot=np.where(dot>1,1,0)
          buckets.update(self.dic[i][str(dot)])
          #print(buckets)
        return buckets


    def ShowData(self,vectors,query_vec):
        x=cosine_similarity(vectors[:,1:],query_vec)
        stack=np.array(sorted(np.hstack((vectors[:,0].reshape(-1,1),x.reshape(-1,1))),key=lambda x : x[-1],reverse=True))
        return stack[:,0]


#load tokenizer and model
with open('/persistent/tokenizer.pkl', 'rb') as file:
  tokenizer=pickle.load(file)
with open('/persistent/model.pkl', 'rb') as file:
  bert=pickle.load(file)

## Load data_title Lsh and data_abstract Lsh

with open('/persistent/LSH_title.pkl', 'rb') as file:
  Lsh_data_title=pickle.load(file)

def convert_to_embedding(in_text, MAX_LEN = 150):

    phrase = re.sub(r"http\S+", "", in_text)
    phrase = re.sub(r"won't", "will not",phrase )
    phrase = re.sub(r"can\'t", "can not", phrase)
    phrase = re.sub(r"n\'t", " not", phrase)
    phrase = re.sub(r"\'re", " are", phrase)
    phrase = re.sub(r"\'s", " is", phrase)
    phrase = re.sub(r"\'d", " would", phrase)
    phrase = re.sub(r"\'ll", " will", phrase)
    phrase = re.sub(r"\'t", " not", phrase)
    phrase = re.sub(r"\'ve", " have", phrase)
    phrase = re.sub(r"\'m", " am", phrase)
    phrase = re.sub('[^A-Za-z0-9]+', ' ', phrase)


    input_ids = tokenizer.encode(
                        phrase, 
                        add_special_tokens = True, 
                        max_length = MAX_LEN,                           
                   )    
    
    #print("input ids",input_ids)

    results = pad_sequences([input_ids], maxlen=MAX_LEN, dtype="long", 
                              truncating="post", padding="post")
    #print("results",results)
    
    # Remove the outer list.
    input_ids = results[0]
    #print("input ids",input_ids)

    # Create attention masks    
    attention_mask = [int(i>0) for i in input_ids]
    #print("attention_mask",attention_mask)
    
    # Convert to tensors.
    input_ids = torch.tensor(input_ids)
    attention_mask = torch.tensor(attention_mask)
    #print("input ids",input_ids)
    #print("attention_mask",attention_mask)
 

    # Add an extra dimension for the "batch" (even though there is only one 
    # input in this batch.)
    input_ids = input_ids.unsqueeze(0)
    attention_mask = attention_mask.unsqueeze(0)

    #print("input ids",input_ids)
    # Put the model in "evaluation" mode, meaning feed-forward operation.
    bert.eval()

    #input_ids = input_ids.to(device)
    #attention_mask = attention_mask.to(device)
    
    # Run the text through BERT, and collect all of the hidden states produced
    # from all 12 layers. 
    with torch.no_grad():        
        o  = bert(
                        input_ids = input_ids, 
                        token_type_ids = None, 
                        attention_mask = attention_mask)
        
        h_s = o[1][1:]

    layer_i = 11 # The last BERT layer before the classifier.
    batch_i = 0 # Only one input in the batch.
    token_i = 0 # The first token, corresponding to [CLS]

    #print(h_s[11].shape)
    # Extract the embedding.
    embedding = h_s[layer_i][batch_i][token_i]

    # Move to the CPU and convert to numpy ndarray.
    embedding = embedding.detach().cpu().numpy()

    return(embedding)

def format_time(elapsed):
    '''
    Takes a time in seconds and returns a string hh:mm:ss
    '''
    # Round to the nearest second.
    elapsed_rounded = int(round((elapsed)))
    
    # Format as hh:mm:ss
    return str(datetime.timedelta(seconds=elapsed_rounded))


with open('/persistent/Final_dataset1.pkl', 'rb') as file:
  dataset=pickle.load(file)

 
data_title_embeddings = pd.read_csv("/persistent/final_embeddings")
data_title_embeddings = data_title_embeddings.drop("Unnamed: 0" , axis=1)


def test(text:None):
  print("Executing")
  t0 = time.time()
  output = pd.DataFrame()
  if text == None:
    query_text_test = "HUMAN BRAIN MIMICS"
  else:
    query_text_test = text
  
  query_embedding=convert_to_embedding(query_text_test)
  indices_data_title=list(map(int,Lsh_data_title.fetch(query_embedding)))

  sorted_title_indices=Lsh_data_title.ShowData(data_title_embeddings.iloc[indices_data_title].to_numpy(),np.array([query_embedding]))
  output = dataset.iloc[sorted_title_indices]
  print("Time taken :",format_time(time.time() - t0))
  out_json = output.to_json(orient='split')  
  return(out_json)


