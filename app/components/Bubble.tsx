interface Message {
    content: string;
    role: string;
}

const Bubble: React.FC<{ message: Message }> = ({ message }) => {
    const { content, role } = message
    return (
        <div className={`${role} bubble`}>{content}</div>
    )
};

export default Bubble;