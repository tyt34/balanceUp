import { useEffect, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import type { ShowMessageFn } from './message.types'

export let showMessageGlobal: ShowMessageFn | null = null

export const Message = () => {
  const [text, setText] = useState<string | null>(null)
  const [show, setShow] = useState(true)

  showMessageGlobal = (newText: string) => {
    setText(newText)
    setShow(true)
  }

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 7777)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show || !text) {
    return null
  }

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
    >
      <Toast
        show={show}
        onClose={() => setShow(false)}
        className="bg-danger text-white"
      >
        <Toast.Header>
          <strong className="me-auto fw-bold">Ошибка</strong>
        </Toast.Header>
        <Toast.Body className="fw-bold">{text}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}
