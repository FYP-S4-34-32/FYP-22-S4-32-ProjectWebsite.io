// ========================================================
// This page is used to display all users in the database
// ========================================================

import { useState, useEffect} from 'react'  
import { useAuthenticationContext } from '../hooks/useAuthenticationContext'
import { useGetAllUsers } from '../hooks/useGetAllUsers'
import { useDeleteUser } from '../hooks/useDeleteUser'

const AllUsers = () => {
    var allUsersArray = []
    var projectAdminsArray = []
    var superAdminsArray = []
    var employeesArray = []
    

    const { user } = useAuthenticationContext() // get the user object from the context 
    const { getAllUsers, getAllUsersIsLoading, getAllUsersError, allUsers } = useGetAllUsers() // get the getAllUsers function from the context
    const { updateUsers, deleteUserIsLoading, deleteUserError} = useDeleteUser() // get the deleteUser function from the context
    const [selectedUsers, setSelectedUsers] = useState('')
    
    const handleGetAllUsers = async () => {
        await getAllUsers()
    }

    const filterUsers = () => {
        allUsersArray = allUsers

        for (var i = 0; i < allUsersArray.length; i++) {
            if (allUsersArray[i].role === "Admin") {
                projectAdminsArray.push(allUsers[i])
            } else if (allUsersArray[i].role === "Super Admin") {
                superAdminsArray.push(allUsers[i])
            } else if (allUsersArray[i].role === "Employee") {
                employeesArray.push(allUsers[i])
            }
        }
    }

    filterUsers()
    // console.log("projectAdminsArray: ", projectAdminsArray)
    // console.log("superAdminsArray: ", superAdminsArray)
    // console.log("employeesArray: ", employeesArray)

    useEffect(() => {
        getAllUsers();
    })


    const deleteUser = (index) => { 
        console.log("deleteUser: ", allUsersArray[index].email)
        updateUsers(allUsersArray[index].email)
    }
 
    
    const showAllUsers = allUsers.map((user) => {
        return (
            <div className="user-div" key={user._id}> 
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Contact Info: {user.contact}</p> 
            </div>
        )
    })

    const showProjectAdmins = projectAdminsArray.map((user) => {
        return (
            <div className="user-div" key={user._id}>
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Contact Info: {user.contact}</p>
            </div>
        )
    })

    const showSuperAdmins = superAdminsArray.map((user) => {
        return (
            <div className="user-div" key={user._id}>
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Contact Info: {user.contact}</p>
            </div>
        )
    }) 
             

    const showEmployees = employeesArray.map((user) => {

        const showSkills = () => {
            user.skills.map((s) => {
                return ( 
                    <p key={ s.skill }>{s.skill}</p> 
                )
            })
        } 

        return (
            <div className="user-div" key={user._id}>
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Contact Info: {user.contact}</p> 
            </div>
        )
    })

    const manageUsers = allUsersArray.map((datum, index) => {
        var user = datum
        
        return (
            <div className="user-div" key={user._id} style={{height:"200px"}}>
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Contact Info: {user.contact}</p>
                <span className="material-symbols-outlined" onClick={() => deleteUser(index)} style={{float:"right", marginRight:"30px", marginBottom:"30px"}}>delete</span> 
                
            </div>
        )
    })


    const showSelectedUsers = () => {
        switch (selectedUsers) {
            case "allUsers":
                return showAllUsers
            case "projectAdmins":
                return showProjectAdmins
            case "superAdmins":
                return showSuperAdmins
            case "employees":
                return showEmployees
            case "manageUsers":
                return manageUsers
            default:
                return showAllUsers
    }}

    return (
        <div>
            <div className="selection-panel">
                <button onClick={handleGetAllUsers}>All Users</button>
                <button onClick={() => setSelectedUsers("projectAdmins")}>Project Admins</button>
                <button onClick={() =>setSelectedUsers("superAdmins")}>Super Admins</button>
                <button onClick={() =>setSelectedUsers("employees")}>Employees</button>
                <button onClick={() =>setSelectedUsers("manageUsers")}>Manage Users</button>
            </div>
            <div className="allUsers-div">
                {showSelectedUsers()}
                {deleteUserError && <p>Error: {deleteUserError}</p>}
            </div>
        </div>
    )

}

export default AllUsers