import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <motion.div 
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;