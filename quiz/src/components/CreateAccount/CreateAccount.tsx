import { useState } from 'react'
import {NAMES_MIN_LENGTH, NAMES_MAX_LENGTH, USERNAME_MIN_LENGTH,
  EMAIL_REGEX, PHONE_REGEX, PASSWORD_MIN_LENGTH, MSG_FIELD_REQUIRED, 
  MSG_USERNAME_TAKEN, MSG_EMAIL_TAKEN, MSG_NAMES_LENGTH, MSG_PASSWORD_LENGTH,MSG_USERNAMES_LENGTH
} from '../../common/constant.ts';
import {createUserHandle, getUserByHandle} from '../../services/users.service.ts'
import { registerUser } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import {FormUser, FormError} from '../../common/typeScriptDefinitions.ts'

const CreateAccount = () => {

  const [form, setForm] = useState<FormUser>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    role: '',
  })
  const [formError, setFormError] = useState<FormError>({
    error: false,
    fieldErr: false,
    firstNameLength: false,
    lastNameLength: false,
    usernameErr: false,
    userNameTakenErr: false,
    passwordErr: false,
    phoneErr: false,
    emailErr: false,
    roleErr: false,
  })
  const navigate = useNavigate();
  const { setContext } = useContext(AppContext);

  const updateNewUser = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if(field === 'firstName') setFormError({...formError, firstNameLength: false, error: false}) 
    if(field === 'lastName') setFormError({...formError, lastNameLength: false, error: false})
    if(field === 'username') setFormError({...formError, usernameErr: false, error: false}) 
    if(field === 'password') setFormError({...formError, passwordErr: false, error: false})
    if(field === 'phone') setFormError({...formError, phoneErr: false, error: false}) 
    if(field === 'email') setFormError({...formError, emailErr: false, error: false})
    if(field === 'role') setFormError({...formError, roleErr: false, error: false})
      
    setForm({
      ...form,
      [field]: e.target.value,
    })
  }

  const updateRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setFormError({...formError, roleErr: false, error: false})
    setForm({ ...form, role: selectedValue });
  };

  const saveNewUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    let errors = { ...formError, error: false };

    if(!form.firstName || !form.lastName || !form.phone || !form.username ||
      !form.password || !form.email || !form.role) {
        errors = ({ ...errors, fieldErr: true, error: true })
            }
    if(form.firstName.length < NAMES_MIN_LENGTH || form.firstName.length > NAMES_MAX_LENGTH){
      errors = ({...errors, firstNameLength:true, error: true})
    }
    if(form.lastName.length < NAMES_MIN_LENGTH || form.lastName.length > NAMES_MAX_LENGTH){
      errors = ({...errors, lastNameLength:true, error: true})
    }
    if(form.username.length < USERNAME_MIN_LENGTH || form.username.length > NAMES_MAX_LENGTH){
      errors = ({...errors, usernameErr:true, error: true})
    }
    if(form.password.length < PASSWORD_MIN_LENGTH || form.username.length > NAMES_MAX_LENGTH){
      errors = ({...errors, passwordErr:true, error: true})
    }
    if(!form.email.match(EMAIL_REGEX)){
      errors = ({...errors, emailErr:true, error: true})
    }
    if(!form.role){
      errors = ({...errors, roleErr:true, error: true})
    }


    setFormError({ ...errors });
    if(errors.error) return "Error form";
    
    
    getUserByHandle(form.username)
    .then(snapshot => {
      if (snapshot.exists()) {
        setFormError({ ...formError, userNameTakenErr: true })
        throw new Error(`User @${form.username} has already been taken!`);
      }

      return registerUser(form.email, form.password);
    })
    .then(credential => {
      return createUserHandle(
        form.username, 
        credential.user.uid, 
        form.email, 
        form.firstName,
        form.lastName, 
        form.phone,
        form.role)
        .then(() => {
          setContext(prevState => ({
            ...prevState,
            user: credential.user
          }));
        });
    })
    .then(() => {
      navigate('/');
    })
    .catch(e => {
      if (e.toString().includes('auth/email-already-in-use')) setFormError({ ...formError, emailErr: true });
      return console.error(e);
    }) 
  }

  return (
  <>
 <div className="isolate bg-white m-10 ">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl text-center font-bold">Registration</h2>
      </div>
      <form className="mx-auto mt-20 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <div className="mt-2.5">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                placeholder="First name"
                className={`input input-bordered w-full
                ${formError.firstNameLength ? 'input-error' : 'input-warning'}`}
                onChange={updateNewUser('firstName')}
                />
                {formError.firstNameLength && <p className="text-red-500">{MSG_NAMES_LENGTH}</p>}
                {formError.fieldErr && !form.firstName && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
                
            </div>
          </div>
          <div>
            
            <div className="mt-2.5">
              <input
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                placeholder='Last name'
                className={`input input-bordered w-full
                ${formError.lastNameLength ? 'input-error' : 'input-warning'}`}
                onChange={updateNewUser('lastName')}
              />
              {formError.lastNameLength && <p className="text-red-500">{MSG_NAMES_LENGTH}</p>}
              {formError.fieldErr && !form.lastName && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            
            <div className="mt-2.5">
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                placeholder="Username"
                className={`input input-bordered w-full
                ${formError.usernameErr ? 'input-error' : 'input-warning'}`}
                onChange={updateNewUser('username')}
              />
              {formError.usernameErr && <p className="text-red-500">{MSG_USERNAMES_LENGTH}</p>}
              {formError.fieldErr && !form.username && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            
            <div className="mt-2.5">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="password"
                placeholder="Password"
                className={`input input-bordered w-full
                ${formError.passwordErr ? 'input-error' : 'input-warning'}`}
                onChange={updateNewUser('password')}
              />
              {formError.passwordErr && <p className="text-red-500">{MSG_PASSWORD_LENGTH}</p>}
              {formError.fieldErr && !form.password && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="mt-2.5 ">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="Email"
                className={`input input-bordered w-full
                ${formError.emailErr ? 'input-error' : 'input-warning'}`}
                onChange={updateNewUser('email')}
              />
              {formError.fieldErr && !form.email && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
            </div>
          </div>
          <div className="sm:col-span-2">  
            <div className="mt-2.5">
            <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                placeholder="Phone number"
                className={`input input-bordered w-full
                ${formError.phoneErr ? 'input-error' : 'input-warning'}`}
                onChange={updateNewUser('phone')}
              /> 
              {formError.fieldErr && !form.phone && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
            </div> 
          </div>
          
          <div className="sm:col-span-2">
          <div className="mt-2.5">
          <select className={`select w-full 
          ${formError.error && formError.roleErr ? 'select-error' : 'select-warning'}`}
          value={form.role}
          onChange={updateRole}>
            <option disabled selected value=''>Choose one</option>
            <option value='student' >Student</option>
            <option value='teacher' >Teacher</option>
            <option value='guest' >Guest</option>
          </select>
          {formError.error && !formError.roleErr && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
          </div> 
          </div>
        </div>
          
        <div className='flex justify-center'>
            <button
            type="button"
            className="block w-1/2 m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={saveNewUser}
          >
            Register
          </button>
        </div>
          
       
      </form>
    </div>
  </>
  )
}

export default CreateAccount;