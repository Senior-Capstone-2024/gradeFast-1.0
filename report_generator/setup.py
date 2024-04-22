from setuptools import find_packages, setup

setup(
  name='report_generator',
  packages=find_packages(include=['report_generator']),
  version='0.0.1',
  description='Generate pdfs from graded student assignments',
  author='Mihai Siia',
  install_requires=['pylatex==1.4.2',
                    'python-dotenv==1.0.1'],
)