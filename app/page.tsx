'use client';

import { CustomFilter, Hero, SearchBar, CarCard, ShowMore } from '@/components';
import { useState, useEffect } from 'react';
import { fuels, yearsOfProduction } from '@/constants';
import { HomeProps } from '@/types';
import { fetchCars } from '@/utils'
import Image from 'next/image'

export default  function Home() {
  // const allCars = await fetchCars({
  //   manufacturer: searchParams.manufacturer || '',
  //   model: searchParams.model || '',
  //   fuel: searchParams.fuel || '',
  //   limit: searchParams.limit || 10,
  //   year: searchParams.year || 2022,
  // });

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // search states
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');

  // filter states
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState(2022);

  // pagination state
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);

    try { 
      const result = await fetchCars({
        manufacturer: manufacturer || '',
        model: model || '',
        fuel: fuel || '',
        limit: limit || 10,
        year: year || 2022,
      });

      setAllCars(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCars();
  }, [manufacturer, model, fuel, year, limit]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
    
  return (
    <main className="overflow-hidden">
      <Hero />

      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4x1 font-extrabold'>Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className='home__filters'>
          <SearchBar 
            setManufacturer={setManufacturer}
            setModel={setModel}
          />

          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels} setFilter={setFuel}/>
            <CustomFilter title='year' options={yearsOfProduction} setFilter={setYear}/>
          </div>
        </div>

        {
          allCars.length > 0 ? (
            <section>
              <div className='home__cars-wrapper'>
                {
                  allCars?.map((car) => (
                    <CarCard 
                      car={car}
                    />
                  ))
                }
              </div>

              {
                loading && (
                  <div className='w-full flex-center mt-16'>
                    <Image
                      src='/loader.svg'
                      alt='loader'
                      width={50}
                      height={50}
                      className='object-contain'
                    />
                  </div>
                )
              }

              <ShowMore
                pageNumber={limit / 10}
                isNext={limit > allCars.length}
                setLimit={setLimit}
              />
            </section>
          ) : (
            <div className='home__error-container'>
              <h2 className='text-black text-x1 font-bold'>NO RESULTS</h2>
              <p>{allCars?.message}</p>
            </div>
          )
        }
      </div>
    </main>
  )
}
