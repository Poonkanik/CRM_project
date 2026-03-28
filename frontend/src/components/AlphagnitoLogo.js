import logo from '../images/solace_logo.svg'; // or .png

const AlphagnitoLogo = ({ size = 36 }) => {
  return (
    <img
      src={logo}
      alt="Alphagnito Logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default AlphagnitoLogo;