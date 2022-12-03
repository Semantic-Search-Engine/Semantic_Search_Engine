import pandas as pd
import numpy as np
from tqdm import tqdm
import time
import datetime
import random
import json

import torch
from keras_preprocessing.sequence import pad_sequences
import torch.optim as optim
from transformers import BertTokenizer,  BertForMaskedLM ,AdamW ,BertConfig 
from sklearn.metrics.pairwise import cosine_similarity

def load_data():
  data  = pd.read_csv("papers_with_abstract.csv")
  print("Data Shape :" , data.shape)

  data = data.drop(["Unnamed: 0","source_id"],axis = 1)
  data['abstract'] = data['abstract'].replace(r'\n', '', regex=True)
  data['full_text'] = data['full_text'].replace(r'\n', '', regex=True)
  return data 

def model_load(FILE = None):

  device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

  # Get the SciBERT pretrained model path from Allen AI repo
  pretrained_model = 'allenai/scibert_scivocab_uncased'

  # Get the tokenizer from the previous path
  sciBERT_tokenizer = BertTokenizer.from_pretrained(pretrained_model, 
                                            do_lower_case=True)

  #objective of the masked language model is to predict the masked token, the label and the inputs are the same                                        do_lower_case=True)
  model = BertForMaskedLM.from_pretrained(pretrained_model,output_attentions=False,
                                                          output_hidden_states=True)
  model.to(device)
  checkpoint = torch.load(FILE,map_location=device)
  model.load_state_dict(checkpoint['model_state'])
  optimizer = optim.AdamW(model.parameters(), lr=5e-5)
  optimizer.load_state_dict(checkpoint['optim_state'])
  model.to(torch.device('cpu'))
  return device , sciBERT_tokenizer , model


def convert_single_abstract_to_embedding(in_text, MAX_LEN = 150):
    
    input_ids = sciBERT_tokenizer.encode(
                        in_text, 
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
    model.eval()

    #input_ids = input_ids.to(device)
    #attention_mask = attention_mask.to(device)
    
    # Run the text through BERT, and collect all of the hidden states produced
    # from all 12 layers. 
    with torch.no_grad():        
        o  = model(
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

def process_query(query_text):
    """
    # Create a vector for given query and adjust it for cosine similarity search
    """
    query_vect = convert_single_abstract_to_embedding(query_text)
    query_vect = np.array(query_vect)
    query_vect = query_vect.reshape(1, -1)
    return query_vect


def get_top_N_articles_cosine(query_text, data, top_N=5):
    """
    Retrieve top_N (5 is default value) articles similar to the query
    """
    query_vect = process_query(query_text)
    revevant_cols = ["title", "abstract", "cos_sim"]
    
    # Run similarity Search
    data["cos_sim"] = data["embeddings"].apply(lambda x: cosine_similarity(query_vect, x))
    data["cos_sim"] = data["cos_sim"].apply(lambda x: x[0][0])
    
    """
    Sort Cosine Similarity Column in Descending Order 
    Here we start at 1 to remove similarity with itself because it is always 1
    """
    most_similar_articles = data.sort_values(by='cos_sim', ascending=False)[1:top_N+1]
    
    return most_similar_articles[revevant_cols]




global device , sciBERT_tokenizer , model 
device , sciBERT_tokenizer , model  = model_load("/persistent/finalcheckpoint19.pth")

a_data = pd.read_pickle("/persistent/data_title_author_aj.pkl")
t_data = pd.read_pickle("/persistent/data_title_author_aj.pkl")

print(t_data.head(5))

def test(text = None):
  print("Testing")
  t0 = time.time()
  output = pd.DataFrame()
  if text == None:
    query_text_test = "HUMAN BRAIN MIMICS"
  else:
    query_text_test = text
  
  output = pd.DataFrame()
  for j in [a_data,t_data]:
    # Get the query text
    # Get the similar articles
    top_articles = get_top_N_articles_cosine(query_text_test, j)
    output = pd.concat([top_articles,output], axis=0)
  print("Results for \" "+query_text_test+ " \"query")

  print(output)
  print("Time taken :",format_time(time.time() - t0))
  out_json = output.to_json(orient='index') 
  return(out_json)


