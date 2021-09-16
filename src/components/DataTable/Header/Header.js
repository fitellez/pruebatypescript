import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
const HeaderComponent = ({ headers, onSorting }) => {

    const [sortingfield, setSortingField] = useState('');
    const [sortingorder, setSortingOrder] = useState('asc');

    const onSortingChange = field => {
        const order = field === sortingfield && sortingorder === 'asc' ? 'desc' : 'asc';
        setSortingField(field);
        setSortingOrder(order);
        onSorting(field, order);
    };
    return ( 
        <thead className='Table-UI-Header text-center'>
                <tr>
                    { headers.map( ({ name, field, sortable}) => ( 
                    <th 
                        key={name}
                        onClick={ () => sortable ? onSortingChange(field): null }
                    >{name}
                        {sortingfield && sortingfield === field && (
                            <FontAwesomeIcon icon={
                                sortingorder === 'asc' ? faArrowDown : faArrowUp
                            } className='ml-1 fa-sm' />
                        )}
                    
                    </th> ) ) }
                </tr>
              </thead>
     );
}
 
export default HeaderComponent;