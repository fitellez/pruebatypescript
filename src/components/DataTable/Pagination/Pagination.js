import React, { useState, useEffect, useMemo } from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationComponent = ({ total=0, itemsPerPage=10, currentpage=1, onPageChange }) => {

    const [totalpages, setTotalPages] = useState(0);

    useEffect(() =>{
        if(total > 0 && itemsPerPage >0){
            setTotalPages(Math.ceil(total/itemsPerPage));
        }
    }, [total, itemsPerPage]);

    const paginationItems = useMemo(()=> {
        const pages = [];

        for (let i = 1; i < totalpages; i++) {
           pages.push(
            <Pagination.Item
                key={i}
                active={i === currentpage}
                onClick={ () => onPageChange(i) }
            >
                {i}
            </Pagination.Item>
           ); 
        }
        return pages;
    }, [totalpages, currentpage]);

    if(totalpages === 0) return null;

  return (
    <Pagination>
        <Pagination.Prev 
                onClick={ () => onPageChange(currentpage-1) }
                disabled={currentpage === 1}
            />
        {paginationItems}
        <Pagination.Next 
            onClick={ () => onPageChange(currentpage+1) }
            disabled={currentpage === totalpages}
        />
    </Pagination>
  );
};

export default PaginationComponent;
