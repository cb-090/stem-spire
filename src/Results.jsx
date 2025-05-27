export default function Results({articles}) {
    return (
        <>
        <ul idname="resultsList">
            {articles.map((article, key) =>
                <li idname="articleBox" key={key}>
                    <h4 idname="title">{article.title}</h4>
                    <p idname="content">{article.content}</p>
                </li>
            )}
        </ul>
        </>
    )
}