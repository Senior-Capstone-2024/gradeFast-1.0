import json
import sys

def json_to_dict(x: str) -> dict :
  data : dict
  if (x[-5::] == '.json'): # checking if file extension is json
    f = open(x, 'r')
    data = json.load(f)
    f.close()
  else:
    data = json.load(x)

  return data
  
if __name__ == '__main__':
  globals()[sys.argv[1]](sys.argv[2])