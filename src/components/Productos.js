import React, { useEffect, useState } from 'react';
import ItemProductoCheckout from './ItemProductoCheckout';



function Productos() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [confirmSelection, setConfirmSelection] = useState(false);
    const [catalogPrices, setCatalogPrices] = useState({});
    const [processComplete, setProcessComplete] = useState(false);
    const [catalog, setCatalog] = useState(() => {
        const localStorageCatalog = JSON.parse(localStorage.getItem("catalog"));
        if (localStorageCatalog)
          return localStorageCatalog;
        return [];
      });

    const [defaultPriceValue, setDefaultPriceValue] = useState(0);
    

    const remove = (i) => {
        const arr = catalog.filter((item) => item !== i);
        setCatalog(arr);
    };


    const changeProductDefaultPrice = (event) => {
        for (var productId in catalogPrices) {
            if (!catalogPrices[productId][0]){
                catalogPrices[productId] = [false, event.target.value]
                setCatalogPrices(catalogPrices)
            }
        }
    }


    const goToCheckout = () => {
        setConfirmSelection(!confirmSelection)
    }

    const finalConfirmation = () => {
        setConfirmSelection(!confirmSelection);
        setProcessComplete(true);
        for (var productId in catalog) {
            if (!(productId in catalogPrices)){
                catalogPrices[productId] = [false, defaultPriceValue]
                setCatalogPrices(catalogPrices)
            }
        }
        setCatalog([])
        console.log( JSON.stringify(catalogPrices))
        setCatalogPrices({})
    }


    useEffect(() => {
        window.localStorage.setItem("catalog", JSON.stringify(catalog));
    }, [catalog]);

    // Pagina actual
    const [selectPage, setSelectPage] = useState(1);
 
    // Cantidad de pag
    const [cantPages, setCantPages] = useState(0);
    useEffect(() => {
        setCantPages(Math.ceil(items.length / 12))
    }, [items]);


    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch("https://fakestoreapi.com/products?limit=50")
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
        return <div>Ha ocurrido un error, intente luego. {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Cargando...</div>;
    } else {
        return (
        <div>   
            <div className={`mt-16 p-10 ${processComplete ? 'hidden' : ''}`}>
                <div className={`mt-5 ${confirmSelection && 'hidden'}`}>
                    <h3 className='text-gray-600 text-2xl font-medium'>Productos</h3>
                    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6'>
                        {items.slice((selectPage-1) * 12).map( (item, index) => index < 12 && (
                        <div key={item.id} className='w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden'>
                            <div className='flex items-end h-96 justify-end bg-cover top-20' style={{ backgroundImage: `url(${item.image})`}}>
                                <button 
                                className={`p-4 m-3 h-20 w-20 rounded-full `}
                                onClick={() => catalog.includes(item.id) ? remove(item.id) : setCatalog([...catalog, item.id])} >
                                    <svg className="p-4 m-3 h-20 w-20" fill={` ${catalog.includes(item.id) ? '#F05050' : '#BDDC30'} `} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24" stroke="currentColor"><path d={` ${catalog.includes(item.id) ? "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" : 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'} `} ></path></svg>
                                </button>    
                            </div>
                            <div className='px-5 py-3'>
                                <h3 className="text-gray-700 uppercase">{item.title}</h3>
                                <span className="text-gray-500 mt-2">${item.price}</span>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className='flex flex-wrap gap-y-2 justify-center'>
                        <div className="flex items-center space-x-1 mt-8">
                            <button onClick={()=> (selectPage > 1) && setSelectPage(selectPage-1)} className="px-5 py-4 cursor-pointer text-gray-500 bg-gray-300 rounded-md hover:bg-slate-900 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                            </button>
                            {
                                [...Array(cantPages)].map((e, i) => 
                                <button key={i+1} onClick={()=> setSelectPage(i+1)} className="px-5 py-4 cursor-pointer text-gray-700 bg-gray-200 rounded-md hover:bg-slate-900 hover:text-white">
                                    {i+1}
                                </button>
                                )
                            }

                            <button onClick={()=> (selectPage < cantPages) && setSelectPage(selectPage+1)} className="px-5 py-4 cursor-pointer text-gray-500 bg-gray-300 rounded-md hover:bg-slate-900 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={` flex flex-col justify-start bg-slate-100 ${!confirmSelection && 'hidden'}`}  >
                        <div className='flex justify-center mt-4'>
                        <label className=' text-2xl'> Porcentaje de comisión: </label>
                        <input className=' text-2x1 w-20 ml-3' type={'number'} placeholder='%' min={0} max={100} onChange={(event) => {setDefaultPriceValue(event.target.value); changeProductDefaultPrice(event)}} value={defaultPriceValue}></input>
                        </div>
                        {items.filter(item =>catalog.includes(item.id)).map( item => (
                            <div key={'selected_' + item.id}>
                                <ItemProductoCheckout item={ item } catalogPrices={ catalogPrices } setCatalogPrices={ setCatalogPrices } defaultPriceValue={ defaultPriceValue } catalog={catalog} setCatalog={setCatalog} />
                            </div>
                        ))}
                </div>

                <div className='flex justify-center gap-4'>
                    <button onClick={()=> goToCheckout()} className='px-5 py-3 mt-10 mb-16 bg-slate-900 hover:bg-slate-400 text-4xl text-white rounded-2xl h-20 w-96 content-center'>
                        {confirmSelection ? 'Volver a selección' : 'Ir a CheckOut'} 
                    </button>
                    {confirmSelection &&
                    (<button onClick={()=> finalConfirmation() } className='px-5 py-3 mt-10 mb-16 bg-slate-900 hover:bg-slate-400 text-4xl text-white rounded-2xl h-20 w-96 content-center'>
                        Confirmar catálogo 
                    </button>)
                    }
                </div>
            </div>
            <div className={` text-2xl ${!processComplete && 'hidden'} `}> Congrats!</div>
        </div> 
        );
    }
}

export default Productos;