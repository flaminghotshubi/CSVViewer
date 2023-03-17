# CSVViewer

CSVViewer is an application to upload csv files and view the content in table format.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the following packages:
- express
- express-session
- mongoose
- multer
- connect-flash
- csv-parser
- ejs

## Usage and Features

- User can view upload csv files. A file can be selected from the list of uploaded files and viewed as tables.
- Notifications appear in case of successful/unsuccessful uploads.
- The tables have search and pagination features. Also the rows can be sorted by columns.
- The application requires a mongodb connection.
- API's are implemented for fetching the list of files, viewing any file and uploading any file.
- Only .csv files are allowed and they should be separated with a comma, though the code can be modified to include other delimiters as well. 

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

