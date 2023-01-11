// ====================================================================================================
// This page allows project admin to define the skills the organisation users can have
// ====================================================================================================
// Only accessible to project admins of an organisation
 
import { useState, useEffect} from 'react'   
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
const { useGetOrganisationSkills } = require('../hooks/useGetOrgSkills');
const { useUpdateOrgSkill } = require('../hooks/useUpdateOrgSkills');

const OrganisationSkills = () => {
    const { user } = useAuthenticationContext()
    const { getOrganisationSkills, allSkills } = useGetOrganisationSkills();
    const { updateOrgSkill, updateOrgSkillsError, updateOrgSkillLoading} = useUpdateOrgSkill();
    const [skillName, setSkillName] = useState("");
    const organisation_id = user.organisation_id;
    const { orgSkillsArray, setOrgSkillsArray} = useState(allSkills);

    // get all skills defined for the organisation
    useEffect(() => { 
        if (user && user.role === "Admin")
            getOrganisationSkills(organisation_id);
    }, []) 

    // Check if skill has already been aded
    const validateSkill = (skillName) => {
        allSkills.forEach(skill => {
            if (skill.skillName === skillName) {
                return false;
            }
        })
        return true; 
    }

    const addNewSkill = async(e) => {
        e.preventDefault();  
        let skillsArr = JSON.parse(JSON.stringify(allSkills));

        if (skillName !== "" || !validateSkill(skillName)) {
            console.log("skill can be added");
            skillsArr.push({skillName}); 
            await updateOrgSkill(organisation_id, skillsArr);

            // after adding the new skill, get all org skills again (updated)
            getOrganisationSkills(organisation_id); 
            console.log("updated allSkills", allSkills);
        } 
        // clear the input field
        setSkillName("");
    } 

    const deletASkill = async(index) => {  
        // get the skill name from the button
        const skill = index;
        console.log("skill to be deleted: ", skill);

        // pop a confirmation message
        if (window.confirm("Are you sure you want to delete the skill: " + skill.skillName + "?")) {
            // remove the skill from the array 
            let skillsArr = allSkills.filter((skill) => skill._id !== index._id);

            
            console.log("updated skillsArr", skillsArr);

            // update the skills array in the database
            await updateOrgSkill(organisation_id, skillsArr);

            // after deleting the skill, get all organisation's skills again (updated)
            getOrganisationSkills(organisation_id); 
            console.log("skill deleted");
            console.log("updated allSkills", allSkills);
        }
    }

    const displaySkills = allSkills.map((datum, index) => {
        var skill = datum;
        return (
            <div className="skill-div" key={skill._id}>
                <span>{skill.skillName}</span>
                <span className="material-symbols-outlined" onClick={() => {deletASkill(skill)}}>delete</span>
                <br/>
            </div>
        )
    }) 

    const displayMsg = () => {
        if (allSkills.length === 0) {
            return (
                <div className="skill">
                    <p> - No skills have been added yet - </p>
                </div>
            )
        }  
    }

    return (
        <div className="organisation-skills">
            <h2>Organisation Skills</h2> 
            
            {displayMsg()}
            <div className='allSkills-div'>
                {displaySkills}
            </div>
            

            <h3>Add New Skill</h3>
            <form onSubmit={addNewSkill}>
                <input type="skillName" placeholder="Add a new skill" onChange={(e) => {setSkillName(e.target.value)}} value={skillName}/>
                <button type="submit">Add</button>
            </form> 
        </div>
    )

}

export default OrganisationSkills