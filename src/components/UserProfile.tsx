// import React, { useState } from 'react';
// import { User } from '../features/userSlice'; // Adjust the import based on your file structure
// import { useDispatch } from 'react-redux';
// import { editProfile } from '../features/userSlice'; // Import the editProfile action

// interface UserProfileProps {
//   user: User | null; // Accept user data as a prop
// }

// const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
//   const dispatch = useDispatch();
//   const [firstName, setFirstName] = useState(user?.firstName || '');
//   const [lastName, setLastName] = useState(user?.lastName || '');
//   const [email, setEmail] = useState(user?.email || '');
//   const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
//   const [gender, setGender] = useState(user?.gender || '');
//   const [address, setAddress] = useState(user?.address || '');
//   const [city, setCity] = useState(user?.city || '');
//   const [country, setCountry] = useState(user?.country || '');
//   const [profileImage, setProfileImage] = useState(user?.profileImage || '');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const updatedUser  = {
//       ...user,
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       gender,
//       address,
//       city,
//       country,
//       profileImage,
//     };
//     dispatch(editProfile(updatedUser)); // Dispatch the editProfile action
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block">First Name</label>
//         <input
//           type="text"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           className="border rounded p-2 w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block">Last Name</label>
//         <input
//           type="text"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           className="border rounded p-2 w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border rounded p-2 w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block">Phone Number</label>
//         <input
//           type="text"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           className="border rounded p-2 w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Gender</label>
//         <select
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//           className="border rounded p-2 w-full"
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="other">Other</option>
//         </select>
//       </div>
//       <div>
//         <label className="block">Address</label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="border rounded p-2 w-full"
//         />
//       </div>
//       <div>
//         <label className="block">City</label>
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="border rounded p-2 w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Country</label>
//         <input
//           type="text"
//           value={country}
//           onChange={(e) => setCountry(e.target.value)}
//           className="border rounded p-2 w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Profile Image URL</label>
//         <input
//           type="text"
//           value={profileImage}
//           onChange={(e) => setProfileImage(e.target.value)}
//           className="border rounded p-2 w-full"
//         />
//       </div>
//       <button type="submit" className="bg-light-primary text-white rounded p-2">
//         Save Changes
//       </button>
//     </form>
//   );
// };

// export default UserProfile;