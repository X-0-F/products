import React, { useEffect, useState } from 'react';



function Productos() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [confirmSelection, setConfirmSelection] = useState(false);
    const [catalog, setCatalog] = useState(() => {
        const localStorageCatalog = JSON.parse(localStorage.getItem("catalog"));
        if (localStorageCatalog)
          return localStorageCatalog;
        return [];
      });
    
    
    const remove = (i) => {
        const arr = catalog.filter((item) => item !== i);
        setCatalog(arr);
    };

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
        <div className='mt-16 p-10'>
            <div className={confirmSelection && 'hidden'}>
                <h3 className='text-gray-600 text-2xl font-medium'>Productos</h3>
                <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6'>
                    {items.slice((selectPage-1) * 12).map( (item, index) => index < 12 && (
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

                <div className='flex flex-wrap gap-y-2 justify-center'>
                    <div className="flex items-center space-x-1 mt-8">
                        <button onClick={()=> selectPage > 1 && setSelectPage(selectPage-1)} className="px-5 py-4 cursor-pointer text-gray-500 bg-gray-300 rounded-md hover:bg-slate-900 hover:text-white">
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

                        <button onClick={()=> selectPage < cantPages && setSelectPage(selectPage+1)} className="px-5 py-4 cursor-pointer text-gray-500 bg-gray-300 rounded-md hover:bg-slate-900 hover:text-white">
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
                    <input className=' text-2x1 w-20 ml-3' type={'number'} placeholder='%' min={0} max={100}></input>
                    </div>
                    {items.filter(item =>catalog.includes(item.id)).map( item => (
                        <div className="flex justify-between mt-6">
                            <div className="flex">
                                <img className="h-20 w-20 object-cover rounded" src={`${item.image}`} />
                                <div className="mx-3">
                                    <h3 className="text-sm text-gray-600">{item.title}</h3>
                                    <div className="flex items-center mt-2">
                                        <button className="text-red-500">
                                            <svg className="h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </button>
                                    </div>
                                    <label>Porcentaje comisión: </label><input className=' text-2x1 w-20 ml-3' type={'number'} placeholder='%' min={0} max={100}></input>
                                </div>
                            </div>
                            <span class="text-gray-600">${item.price}</span>
                        </div>
                    ))}
            </div>

            <div className='flex justify-center gap-4'>
                <button onClick={()=> setConfirmSelection(!confirmSelection)} className='px-5 py-3 mt-10 mb-16 bg-slate-900 hover:bg-slate-400 text-4xl text-white rounded-2xl h-20 w-96 content-center'>
                    {confirmSelection ? 'Volver a selección' : 'Ir a CheckOut'} 
                </button>
                {confirmSelection &&
                <button onClick={()=> setConfirmSelection(!confirmSelection)} className='px-5 py-3 mt-10 mb-16 bg-slate-900 hover:bg-slate-400 text-4xl text-white rounded-2xl h-20 w-96 content-center'>
                    Confirmar catálogo 
                </button>
                }
            </div>
        </div>
        );
    }
}

export default Productos;