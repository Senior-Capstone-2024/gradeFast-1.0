'''
call with "python3 report_generator/main.py path/to/json"
'''
from dotenv import load_dotenv
from pylatex import Document, Section, LineBreak, NewPage, PageStyle, Package
from pylatex.utils import bold, NoEscape

import os
from os import path
import sys
import json

from util.parse_json import json_to_dict
# from classes.Assignment import Assignment

def format_doc():
  
  geometry_options = {
    'margin': '0.5in'
  }
  
  doc = Document(geometry_options=geometry_options)
  doc.change_document_style('empty')
  return doc

def assemble_pdf(json_file_path: str):
  # Load JSON data from file
  with open(json_file_path, 'r') as f:
    data = json.load(f)
  
  # load path to pdflatex
  dotenv_path = path.join(path.dirname(__file__), '.env')
  load_dotenv(dotenv_path)
  print(dotenv_path)
  PDFLATEX_PATH = os.environ.get('PDFLATEX_PATH')
    
  doc = format_doc()
    
  keys = list(data.keys())
  with doc.create(Section(NoEscape(r'\centerline{' + keys[0] + '}'), numbering=False)):
    for key in keys:
      doc.append(key + ":")
      doc.append(data.get(key))
      doc.append('\n')
    
  doc.append(NewPage())
  
  doc.generate_pdf('report_out/report_out', clean_tex=False, compiler=PDFLATEX_PATH)
  # doc = format_doc()
  # doc.append(NewPage())
  # doc.generate_pdf('out/out', clean_tex=False, compiler='pdflatex', silent=False)
  
if __name__ == '__main__':
  assemble_pdf(sys.argv[1])
