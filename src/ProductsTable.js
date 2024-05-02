import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button } from '@mui/material';
import {saveAs} from "file-saver";

const ProductsTable = () => {
	const [products, setProducts] = useState([]);
  	const [page, setPage] = useState(0);
  	const [rowsPerPage, setRowsPerPage] = useState(5);
  	const [searchTerm, setSearchTerm] = useState('');

  	useEffect(() => {
  		fetch('https://dummyjson.com/products')
    		.then(response => response.json())
    		.then(data => {
     		if (Array.isArray(data.products)) {
        		setProducts(data.products);
      		} else {
        		console.error('Products data is not an array:', data);
      		}
    		})
    		.catch(error => console.error('Error fetching products:', error));
	}, []);


	const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase())
 	);

  	const hChangePage = (event, newPage) => {
    		setPage(newPage);
  	};

  	const hChangeRowsPerPage = (event) => {
    		setRowsPerPage(+event.target.value);
    		setPage(0);
  	};

  	const hSearch = (event) => {
    		setSearchTerm(event.target.value);

  	};

  	const hDownloadCSV = () => {
  		const csvContent = "Product,Description,Price,Discount Percentage,Rating,Stock,Brand,Category\n"
   		 + filteredProducts.map(product =>
      		`${quoteIfNeeded(product.title)},${quoteIfNeeded(product.description)},${product.price},${product.discountPercentage},${product.rating},		 ${product.stock},${quoteIfNeeded(product.brand)},${quoteIfNeeded(product.category)}`
    		).join("\n");

  		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

  		saveAs(blob, 'products.csv');
	};

	const quoteIfNeeded = (value) => {
 		if (value.includes(',') || value.includes('"')) {
    		return `"${value.replace(/"/g, '""')}"`;
  		}
  	return value;
	};

return (
    <Paper style={{"background-color":"azure"}}>
      <br/>
      <TextField
        label="Search Products"
        value={searchTerm}
        onChange={hSearch}
      />
      <TableContainer>
	<br/>
        <Table border="1" style={{"width":"30"}} className="product-table">
          <TableHead>
            <TableRow>
              <TableCell style={{"font-weight":"bold"}}>Product</TableCell>
              <TableCell style={{"font-weight":"bold"}}>Description</TableCell>
              <TableCell style={{"font-weight":"bold"}}>Price</TableCell>
	      <TableCell style={{"font-weight":"bold"}}>Discount Percentage</TableCell>
	      <TableCell style={{"font-weight":"bold"}}>Rating</TableCell>
	      <TableCell style={{"font-weight":"bold"}}>Stock</TableCell>
	      <TableCell style={{"font-weight":"bold"}}>Brand</TableCell>
	      <TableCell style={{"font-weight":"bold"}}>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
              <TableRow key={product.id}>
		<TableCell><img src={product.thumbnail}/><br/>{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{"\u0024" + product.price}</TableCell>
                <TableCell>{product.discountPercentage + "%"}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category}</TableCell>
		
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={hChangePage}
        onRowsPerPageChange={hChangeRowsPerPage}
	SelectProps={{
    	style: {
      		fontSize: '28px', 
      		paddingLeft: '8px', 
      		paddingRight: '8px',
    	},
  	}}
      />
      <Button onClick={hDownloadCSV} style={{"border":"solid"}} onMouseEnter={(e) => e.target.style.opacity = 0.8}
      onMouseLeave={(e) => e.target.style.opacity = 1}>Download CSV</Button>
    </Paper>
  );
};

export default ProductsTable;
