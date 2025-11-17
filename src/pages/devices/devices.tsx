import { Container, Row, Alert, Col } from 'react-bootstrap'
import { DeviceCard } from '../../components/device-card'
import { deviceStore } from '../../store/deviceStore'
import { Header } from '../../components/header'
import { LoadingPage } from '../loading'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

export const DevicesPage = observer(() => {
  useEffect(() => {
    const fetchAndLog = async () => {
      await deviceStore.fetchDevices()
    }

    fetchAndLog()
  }, [])

  if (deviceStore.loading) {
    return <LoadingPage />
  }

  if (deviceStore.error) {
    return (
      <>
        <Header></Header>
        <Container className="text-center mt-5">
          <Alert variant="danger">{deviceStore.error}</Alert>
        </Container>
      </>
    )
  }

  return (
    <>
      <Header></Header>

      <Container className="mt-4 pb-5">
        <Row className="justify-content-center g-5">
          {deviceStore.devices.map((device) => {
            return (
              <Col
                key={device.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <DeviceCard device={device}></DeviceCard>
              </Col>
            )
          })}
        </Row>
      </Container>
    </>
  )
})
