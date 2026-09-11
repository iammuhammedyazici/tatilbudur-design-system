// Storybook adapter: native Modal previews stay inside their PhoneFrame.
// Published native components continue importing the real react-native Modal.
import { Modal as NativeWebModal } from 'react-native-web';
import { PhoneModal } from '../src/stories/PhoneModal';
export * from 'react-native-web';
export const Modal = (props) => (
  <PhoneModal {...props} fallback={NativeWebModal} />
);
