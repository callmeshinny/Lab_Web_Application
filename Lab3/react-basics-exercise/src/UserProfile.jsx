import PropTypes from 'prop-types';

function UserProfile({ userData, theme = 'light' }) {
  return (
    <div className={`profile-card theme-${theme}`}>
      <h2>{userData.name}</h2>
      <p>{userData.email}</p>
    </div>
  );
}

// Prop validation
UserProfile.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
  }),
  theme: PropTypes.string,
};

export default UserProfile;
