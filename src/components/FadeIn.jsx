import { motion } from "motion/react";

export default function FadeIn({ children, delay = 0, className = "" }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay }}
        >
            {children}
        </motion.div>
    );
}