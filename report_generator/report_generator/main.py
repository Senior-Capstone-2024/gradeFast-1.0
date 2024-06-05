'''
call with "python3 report_generator/main.py path/to/json"
'''
from dotenv import load_dotenv
from pylatex import Document, Section, LineBreak, NewPage, PageStyle, Package
from pylatex.base_classes import Environment
from pylatex.utils import bold, NoEscape
import os
from os import path
import sys
import json

from util.parse_json import json_to_dict


class syntax_code(Environment):
  _latex_name = 'minted'
  #packages = [Package('minted')]
  start_arguments = 'java'
  escape = False
  content_separator = '\n'
  def __init__(self, *, options=None, arguments=None, start_arguments=start_arguments, **kwargs):
    super().__init__(options=options, arguments=arguments, start_arguments=start_arguments, **kwargs)

class syntax_code(Environment):
  _latex_name = 'minted'
  #packages = [Package('minted')]
  start_arguments = 'java'
  escape = False
  content_separator = '\n'
  def __init__(self, *, options=None, arguments=None, start_arguments=start_arguments, **kwargs):
    super().__init__(options=options, arguments=arguments, start_arguments=start_arguments, **kwargs)

def format_doc():
  
  geometry_options = {
    'margin': '0.5in'
  }
  
  doc = Document(geometry_options=geometry_options)
  doc.change_document_style('empty')
  doc.packages.append(Package(name='minted'))
  doc.packages.append(Package(name='setspace'))
  doc.preamble.append(NoEscape(r'\SetSinglespace{1.1}'))
  doc.preamble.append(NoEscape(r'\singlespacing'))
  return doc

def assemble_pdf(json_file_path: str, assignment_path: str, out_dir: str='./out/out'):
  assignment = open(assignment_path).read().splitlines()

  # Load JSON data from file
  with open(json_file_path, 'r') as f:
    data = json.load(f)

  data: dict
  # load path to pdflatex
  dotenv_path = path.join(path.dirname(__file__), '.env')
  load_dotenv(dotenv_path)
  PDFLATEX_PATH = os.environ.get('PDFLATEX_PATH')
  
  doc = format_doc()
    
  keys = list(data.keys())
  print(keys)
  with doc.create(Section(NoEscape(r'\centerline{Code Report}'), numbering=False)):
    for count, line in enumerate(assignment):
      if data.get(str(count + 1)) is not None:
        text = data.get(str(count + 1))
        doc.append(str(text))
      else:
        with doc.create(syntax_code()):
          # text = ''.join([line])
          text = (line)
          doc.append(text)
  
  doc.generate_pdf(out_dir, clean_tex=False, compiler=PDFLATEX_PATH, compiler_args=['-shell-escape'])
  # doc = format_doc()
  # doc.append(NewPage())
  # doc.generate_pdf('out/out', clean_tex=False, compiler='pdflatex', silent=False)

if __name__ == '__main__':
  assemble_pdf(sys.argv[1], sys.argv[2])
