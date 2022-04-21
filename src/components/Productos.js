import React, { useEffect, useState } from 'react';



function Productos() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [catalog, setCatalog] = useState(() => {
        const localStorageCatalog = JSON.parse(localStorage.getItem("catalog"));
        console.log(localStorageCatalog)
        if (localStorageCatalog)
          return localStorageCatalog;
        return [];
      });
    
    const remove = (i) => {
        const arr = catalog.filter((item) => item !== i);
        setCatalog(arr);
    };
 
    useEffect(() => {
        // Access initial value from session storage
        window.localStorage.setItem("catalog", JSON.stringify(catalog));
    }, [catalog]);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch("https://fakestoreapi.com/products?limit=20")
        .then(res => res.json())
        .then(
            (result) => {
            setIsLoaded(true);
            setItems(result);
            },
            // Nota: es importante manejar errores aquí y no en 
            // un bloque catch() para que no interceptemos errores
            // de errores reales en los componentes.
            (error) => {
            setIsLoaded(true);
            setError(error);
            }
        )
    }, [])
    
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
        <div className='mt-16'>
            <h3 className='text-gray-600 text-2xl font-medium'>Productos</h3>
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6'>
                {items.map(item => (
                <div key={item.id} className='w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden'>
                    <div className='flex items-end h-96 justify-end bg-cover top-20' style={{ backgroundImage: `url(${item.image})`}}>
                        <button 
                        className={`p-4 m-3 h-20 w-20 rounded-full ${catalog.includes(item.id) ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300' : 'bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'}
                        `}
                        onClick={() => catalog.includes(item.id) ? remove(item.id) : setCatalog([...catalog, item.id])} >  
                        </button>    
                    </div>
                    <div className='px-5 py-3'>
                        <h3 className="text-gray-700 uppercase">{item.title}</h3>
                        <span className="text-gray-500 mt-2">${item.price}</span>
                    </div>
                    
                </div>
                ))}
            </div>
        </div>
        );
    }
}

export default Productos;