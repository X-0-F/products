import React, { useEffect, useState } from 'react';


function ItemProductoCheckout( { item , catalogPrices, setCatalogPrices, defaultPriceValue, catalog, setCatalog} ) {
    const [valor, setValor] = useState( item.id in catalogPrices ? catalogPrices[item.id][1] : 0)

    const changeValor = (event) => {
        if (event.target.value < 101 && event.target.value > -1){
            setValor(event.target.value)
            changeProductPrice(item.id, event.target.value)
        }
        if (event.target.value == 0) {
            delete catalogPrices[item.id]
            setCatalogPrices(catalogPrices)
            setValor(defaultPriceValue)
        }
    }

    const changeProductPrice = (i, newValor) => {
        catalogPrices[i] = [true, newValor]
        setCatalogPrices(catalogPrices)
    }

    const remove = (i) => {
        const arr = catalog.filter((item) => item !== i);
        delete catalogPrices[i]
        setCatalogPrices(catalogPrices)
        setCatalog(arr);
    };

    useEffect(() => {
        if (!(item.id in catalogPrices))
            setValor(defaultPriceValue)
    }, [defaultPriceValue]);

    const getNewPriceProduct = () =>{
        if (item.id in catalogPrices)
            return (item.price + (item.price*catalogPrices[item.id][1])/100).toFixed(1)
        return (item.price + item.price * defaultPriceValue/100).toFixed(1)
    }

    return (
        <div className="flex justify-between mt-6">
            <div className="flex">
                <img className="h-20 w-20 object-cover rounded" src={`${item.image}`} alt={item.title} />
                <div className="mx-3">
                    <h3 className="text-sm text-gray-600">{item.title}</h3>
                    <div className="flex items-center mt-2">
                        <button onClick={() => catalog.includes(item.id) ? remove(item.id) : setCatalog([...catalog, item.id])} className="text-red-500">
                            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </div>
                    <label>Porcentaje comisión: </label><input className=' text-2x1 w-20 ml-3' type={'number'} placeholder='%' min={0} max={100} value={valor} onChange={(event)=> changeValor(event)}></input>
                </div>
            </div>
            <span className="text-gray-600">${getNewPriceProduct()}</span>
        </div>
    )
}

export default ItemProductoCheckout;