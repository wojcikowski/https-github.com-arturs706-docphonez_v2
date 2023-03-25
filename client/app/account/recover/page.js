import styles from './page.module.css'
import refreshToken from '../../../checkCr';
import { useDispatch } from 'react-redux';


export default function Page() {
  const dispatch = useDispatch()

  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
    }, []);

  return (
    <div>P</div>
  )
}
