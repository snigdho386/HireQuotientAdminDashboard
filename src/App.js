import { Routes, Route } from "react-router-dom";
import Searchbar from './components/Searchbar/SearchBar'
import { AiFillDelete, AiFillEdit, AiFillSave } from "react-icons/ai";
import * as ReactBootStrap from 'react-bootstrap'
import { useState,useEffect } from 'react'
import './app.css'
const App = () => {

   //Initialization
   const [users, setUsers] = useState([]);
   const [currentPage,setCurrentPage] = useState(1);
   const [searchText,setSearchText]=useState("");
   const [selectedRows, setSelectedRows] = useState([]);
   const [selectAll, setSelectAll] = useState(false);
 
   let filteredUsers=users.filter((user) => {
       if (searchText === "") return user;
       else if (
         user.name.includes(searchText) ||
         user.email.includes(searchText) ||
         user.role.includes(searchText)
       ) {
         return user;
       }
   }) 
   // Pagination Start
   const itemsPerPage=10;
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
   console.log("Indexes", indexOfFirstItem, indexOfLastItem);
 
   //Functions
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
   const getSearchText=(str)=>{
     setSearchText(str);
     console.log("Search Text", searchText);
   }
   
   const handleCheckboxChange = (id) => { 
    console.log("Selected")
     let updatedSelection = [...selectedRows];
     if (updatedSelection.includes(id)) {
       updatedSelection = updatedSelection.filter((selectedId) => selectedId !== id);
     } else {
       updatedSelection.push(id);
     }
    
     if(updatedSelection.length==10) 
     {  
        
        setSelectAll(true);
     } 
      else{ 
       setSelectAll(false);
      }
     setSelectedRows(updatedSelection)
    };
     
 
   const handleSelectAll = () => {
     if (selectAll) {
       setSelectedRows([]);
     } else {
       const allIds = currentItems.map((row) => row.id);
       setSelectedRows(allIds);
     }
     setSelectAll(!selectAll);
   };
 
   const handleDeleteAll=()=>{
     const excludedArray = [];
     users.forEach((element) => {
       if (!selectedRows.includes(element.id)) {
         excludedArray.push(element);
       }
     }) 
     console.log("Excluded array : ", excludedArray);
     setUsers(excludedArray);
     setSelectAll(!selectAll); 
   }
   const handleInputChange = (id, field, value) => {
     const updatedUser = users.map((user) => {
       if (user.id === id) {
         return { ...user, [field]: value };
       }
       return user;
     });
     setUsers(updatedUser);
   };
   const handleEdit = (id) => {
     const updatedUser = users.map((user) => {
       if (user.id === id) {
         return { ...user, editable: !user.editable };
       }
       return user;
     });
     setUsers(updatedUser);
   };
   const handleSave = (id) => {
     const updatedUser = users.map((user) => {
       if (user.id === id) {
         return { ...user, editable: !user.editable };
       }
       return user;
     });
     setUsers(updatedUser);
   };
 
   //Fetch and useEffect
   useEffect(() => {
     getUsersDetails(); 
   },[]);
   // Delete User data onClick
   const deleteUser = (selectedUser) => {
     let userAfterDeletion = users.filter((user) => {
       return user.id !== selectedUser;
     });
     setUsers(userAfterDeletion);
   };
   const getUsersDetails = () => {
     fetch(
       `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
     )
       .then((res) => res.json())
       .then((data) => {
         const usersEditable=data.filter(user=>{
           console.log(user);
           user["editable"]=false; 
           return user;
         })
         console.log("Users: ",usersEditable);
         setUsers(usersEditable);
         
       })
       // error
       .catch((err) => {
         console.log("Error:", err);
       });
   };
 
   return (
     <div className="App">

      {/* SearchBar Component */}
       <div className='d-flex justify-content-between align-items-center'>
             <Searchbar callBack={getSearchText}/> 
             <button onClick={handleDeleteAll}>
               <AiFillDelete />
             </button>
       </div>
       
 
     {/* TableComponent */}
     <ReactBootStrap.Table  bordered hover>
       <thead>
         <tr>
           <th>
             <input 
               type="checkbox" 
               onChange={handleSelectAll}
               checked={selectAll}
             />
           </th>
           <th>Name</th>
           <th>Email</th>
           <th>Role</th>
           <th>Actions</th>
         </tr>
       </thead>
       <tbody> 
       {
         currentItems.map(user=>(
             <> 
                   <tr key={user.id}  className={selectedRows.includes(user.id) ? 'selected' : ''} >
                     <td className={selectedRows.includes(user.id)?"selected":""}>
                       <input 
                         type="checkbox" 
                         onChange={() => handleCheckboxChange(user.id)}
                         checked={selectedRows.includes(user.id)} 
                       />
                     </td>
                     <td className={selectedRows.includes(user.id)?"selected":""}> 
                       {user.editable ? 
                           <input
                             type="text"
                             value={user.name}
                             onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}
                           />
                          :
                           user.name
                         }</td>
                     <td className={selectedRows.includes(user.id)?"selected":""}>
                         {
                           user.editable ? 
                             <input
                               type="text"
                               value={user.email}
                               onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}
                             />
                           :
                             user.email
                         }
                     </td>
                     <td className={selectedRows.includes(user.id)?"selected":""}>
                         {
                           user.editable ? 
                             <input
                               type="text"
                               value={user.role}
                               onChange={(e) => handleInputChange(user.id, 'role', e.target.value)}
                             />
                           :
                             user.role
                         }
                     </td>
                     <td className={selectedRows.includes(user.id)?"d-flex align-items-start gap-2 selected":"d-flex align-items-start gap-2"}> 
         
                       {
                         user.editable ? 
                           <button onClick={() =>handleSave(user.id)}><AiFillSave/></button>
                           : 
                           <button onClick={() =>handleEdit(user.id)}><AiFillEdit/></button>  
                       }
                       <button onClick={()=>deleteUser(user.id)} >
                         <AiFillDelete />
                       </button>
                   </td>
                 </tr>
             </>  
         ))
       }
       </tbody>
     </ReactBootStrap.Table>
 
     {/* Pagination */}
     <ReactBootStrap.Pagination>
         {/* Pagination controls */}
         <div className="first-page">
            <ReactBootStrap.Pagination.First
            onClick={()=>setCurrentPage(1)}
            disabled={currentPage === 1}
          />
         </div>
        <div className="previous-page">
           <ReactBootStrap.Pagination.Prev
           onClick={() => setCurrentPage(currentPage - 1)}
           disabled={currentPage === 1}
         />
        </div>
        
         {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
           <ReactBootStrap.Pagination.Item
             key={i}
             active={i + 1 === currentPage}
             onClick={() => paginate(i + 1)}
           >
             {i + 1}
           </ReactBootStrap.Pagination.Item>
         ))}
         <div className="next-page">
            <ReactBootStrap.Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
          />
         </div>
         <div className="last-page">
            <ReactBootStrap.Pagination.Last
            onClick={()=>setCurrentPage(Math.ceil(filteredUsers.length / itemsPerPage))}
            disabled={currentPage===Math.ceil(filteredUsers.length / itemsPerPage)}
          />
         </div>
       </ReactBootStrap.Pagination>
   </div>
   )
};

export default App;
