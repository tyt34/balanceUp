import { Container, Spinner } from 'react-bootstrap'
import { Header } from '../../components/header'

export const LoadingPage = () => {
  return (
    <>
      <Header></Header>

      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    </>
  )
}
