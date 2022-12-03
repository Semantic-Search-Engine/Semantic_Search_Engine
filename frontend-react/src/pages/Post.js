export function Post(props){
    return(
        <div>
            <div>ID: {props.post.id}</div>
            <div>Title: {props.post.title}</div>
            <div>Abstact: {props.post.abstract}</div>
        </div>
    )
}