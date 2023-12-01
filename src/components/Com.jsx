import React from 'react'
import { a, useSpring , config } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'


const items = ['save item', 'open item', 'share item', 'delete item', 'cancel']
const height = items.length * 60 +80

const Com = () => {

  const [{y} , api] = useSpring(() => ({y : height}));
  const open = ({canceled}) => {
    api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
    // api.start({y : 0})
  }

  const close = (velocity = 0) => {
    api.start({ y: height, immediate: false, config: { ...config.stiff, velocity } })
  }

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], offset: [, oy], cancel, canceled }) => {
      if (oy < -70) cancel()
      if (last) {
        oy > height * 0.5 || (vy > 0.5 && dy > 0) ? close(vy) : open({ canceled })
      }
      else api.start({ y: oy, immediate: true })
    },
    { from: () => [0, y.get()], 
      // filterTaps : difference between click and drag
      filterTaps :true ,
      // define boundry only dragable inside boundry
      bounds: {top : 0} , 
      // tigger after the bounds cross
      rubberband :true}
  )

  const display = y.to((py) => (py < height) ? 'block' : 'none')
  const bgStyle = {
    transform : y.to([0 , height] , ['translateY(-8%) scale(1.16)' , 'translate(0px) scale(1.05)']),
    opacity : y.to([0 , height] , [0.4, 1])
  }
  return (
    <div className='flex overflow-hidden'>
      <a.div 
        className=' w-full'
        onClick={() => close()}
        style={bgStyle}
      >
        <img
          className='w-full m-0 block'
          src="https://images.pexels.com/photos/1239387/pexels-photo-1239387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
        />
        <img
          className='w-full m-0 block'
          src="https://images.pexels.com/photos/5181179/pexels-photo-5181179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt=""
        />
      </a.div>
      <button 
        className='w-[60px] h-[60px] rounded-full bg-orange-500 border-none shadow-2xl fixed right-[80px] bottom-[60px]'
        onClick={open}
      />
      
      <a.div
        className='fixed left-[2vw] z-[100] bg-white w-[94vw] select-none rounded-t-lg '
        style={{
          display ,
          bottom : `calc(-100vh + ${height - 100}px)`,
          height : 'calc(100vh + 100px)',
          y,
        }}
        {...bind()}
      >
        {
          items.map((item , index) => (
            <div
              className='flex justify-center items-center px-[20px] capitalize h-[60px]'
              key={index}
              onClick={() => (index < items.length -1 ? alert('clicked on ' + item) : close())}
              children={item}
            />
          ))
        }
      </a.div>
    </div>
  )
}

export default Com
