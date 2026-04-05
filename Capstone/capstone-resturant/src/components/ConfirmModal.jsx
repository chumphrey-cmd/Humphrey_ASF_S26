import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export default function ConfirmModal({ isOpen, toggle, title, message, confirmText, onConfirm, cancelText, isThankYou }) {
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered backdrop="static">
            {/* We only show the header if a title is provided */}
            {title && (
                <ModalHeader toggle={toggle} className="border-0 pb-0">
                    {title}
                </ModalHeader>
            )}

            <ModalBody className="text-center py-5 fs-5">
                {message}
            </ModalBody>

            {/* We hide the buttons if this is the Thank You modal, since it auto-redirects! */}
            {!isThankYou && (
                <ModalFooter className="border-0 pt-0 justify-content-center pb-4">
                    <Button color="danger" className="px-4 me-2" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                    <Button color="secondary" className="px-4" onClick={toggle}>
                        {cancelText}
                    </Button>
                </ModalFooter>
            )}
        </Modal>
    );
}