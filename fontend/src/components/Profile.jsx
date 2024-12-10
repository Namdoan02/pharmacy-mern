
const Profile = ({ username, userRole }) => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-700">Profile Page</h1>
      <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800">User Information</h2>
        <div className="mt-2">
          <p className="text-gray-600"><strong>Username:</strong> {username}</p>
          <p className="text-gray-600"><strong>Role:</strong> {userRole}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
