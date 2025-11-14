import PropTypes from 'prop-types';

function UserProfile({ userData, theme = 'light' }) {
  const { name, email, avatarUrl, imageSize = 90, role } = userData;

  return (
    <>
      <article className={`profile-card theme-${theme}`}>
        <div className="profile-content">
          <h2>User Profile</h2>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          {role && <p className="user-role">{role}</p>}
        </div>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            width={imageSize}
            height={imageSize}
            className="profile-avatar"
          />
        )}
      </article>
    </>
  );
}

UserProfile.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatarUrl: PropTypes.string,
    imageSize: PropTypes.number,
    role: PropTypes.string,
  }).isRequired,
  theme: PropTypes.string,
};

export default UserProfile;
