import React from "react";

interface BookCardProps {
    title: string;
    author: string;
    coverUrl?: string;
    width?: number;
    height?: number;
}

export default function BookCard({
                                     title,
                                     author,
                                     coverUrl,
                                     width = 50,
                                     height = 70,
                                 }: BookCardProps) {
    const firstLetter = title.charAt(0).toUpperCase();
    const [imageError, setImageError] = React.useState(false);

    return (
        <div className="flex items-center mb-3 p-2 bg-white rounded shadow-sm">
            {coverUrl && !imageError ? (
                <img
                    src={coverUrl}
                    alt={title}
                    style={{
                        width,
                        height,
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginRight: 15,
                    }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div
                    style={{
                        width,
                        height,
                        backgroundColor: "#ddd",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#555",
                        marginRight: 15,
                    }}
                >
                    {firstLetter}
                </div>


            )}

            {/*<div>*/}
            {/*    <h6 className="font-semibold">{title}</h6>*/}
            {/*    <p className="text-sm text-gray-600">{author}</p>*/}
            {/*</div>*/}
        </div>
    );
}
