// Security disabled: this app no longer requires a logged-in user or token.
// PrivateRoute now simply renders whatever page it wraps.
export default function PrivateRoute({ children }) {
  return children;
}
