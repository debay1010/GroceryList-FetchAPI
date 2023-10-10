import { useState, useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import { FaRocketchat } from 'react-icons/fa';
import apiRequest from './apiRequest';

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Blogs from './pages/Blogs';
// import Contact from './pages/Contact';
// import Layout from './pages/Layout';
// import NoPage from './pages/NoPage';

function App() {
  const API_URL = 'http://localhost:3500/items'

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('Did not receive expected data');
        const listItems = await response.json();
        console.log(listItems);
        setItems(listItems);
        if (response.ok) setFetchError(null);//That "if condition" is my personal invention means there was no error so far
      } catch (error) {
        //console.log(error.stack)
        setFetchError(error.message) // store error in fecthError field
        console.log(fetchError);
      } finally {
        setIsLoading(false);
      }

    }
    setTimeout(() => {
      (async () => fetchItems())();
    }, 2000)

  }, [])


  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result)
  }


  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

    const myitem = listItems.filter((item) => item.id === id);

    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checked: myitem[0].checked })
    }
    const reqUrl = `${API_URL}/${id}`
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);
  }

  const handleDelete = async (id) => {
    console.log(`key: ${id}`);
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id)
    const deleteOptions = { method: 'DELETE' }
    const reqUrl = `${API_URL}/${id}`

    const result = await apiRequest(reqUrl, deleteOptions)
    if (result) setFetchError(result);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return
    addItem(newItem);
    setNewItem('');
  }

  return (
    <>
      <div className='App'>
        <Header title='Groceries List' />

        <AddItem
          newItem={newItem}
          setNewItem={setNewItem}
          handleSubmit={handleSubmit} />
        <SearchItem
          search={search}
          setSearch={setSearch} />
        <main>
          {isLoading && <p style={{ color: 'lightgreen' }} >...Data being fetched</p>}
          {fetchError && < p style={{ color: 'Red' }} >Error: {fetchError}</p>}
          {!fetchError && !isLoading && <Content
            items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
            handleCheck={handleCheck}
            handleDelete={handleDelete} />
          }
        </main>

        <Footer length={items.length} />

      </div >
    </>

  );
}



export default App;


