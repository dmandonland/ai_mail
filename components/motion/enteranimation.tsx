import * as motion from "motion/react-client"

export default function LogoEnter() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                delay: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
        >
            <Infinityshape />
        </motion.div>

    )
}

function Infinityshape() {
    return (
        <div className="p-20">
        <div className="relative w-[212px] h-[100px] box-content 

          before:content-[''] before:absolute before:top-0 before:left-0
          before:h-[60px] before:w-[60px] before:border-[20px] 
        before:border-black before:border-solid before:rounded-t-[50px]
          before:rounded-tr-[50px] before:rounded-b-0 before:rounded-l-[50px] 
          before:-rotate-45 before:box-content 

          after:content-[''] after:absolute after-top-0 after:right-0 
          after:left-auto after:h-[60px] after:w-[60px] after:border-[20px] 
        after:border-black after:border-solid after:rounded-t-[50px] 
          after:rounded-r-[50px] after:rounded-b-0 after:rounded-l-0 
          after:rotate-45 after:box-content">
        </div>
      </div>
    )
}