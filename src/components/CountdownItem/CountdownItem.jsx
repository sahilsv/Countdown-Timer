import './CountdownItem.css';

const CountdownItem = ({label,value}) => {
  return (
    <div className='countdown-item'>
        <span className='countdown-value'>{value}</span>
        <span className='countdown-label'>{label}</span>
    </div>
  )
}

export default CountdownItem