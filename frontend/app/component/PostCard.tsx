
import { Heart, MessageCircleCode } from "lucide-react";


type Props = {
  _id?: string;
  image: string;
  category: string;
  title: string;
  description: string;
  author: {name: string, img: string}
  date: string;
  like: {count: number, isliked: Boolean}
  readTime: string;
};

export default function PostCard({ post, onLike } : { post: Props; onLike: ((id:string) => void) }) {
  return (
    <div className="bg-white border border-gray-200 gap-y-4 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category Tag */}
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
          {post.category}
        </span> • {post.readTime}

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 leading-snug pt-4  cursor-pointer">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {post.description}
        </p>

        {/* Footer: Author & Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            <div className="gap-2 flex items-center">
              <img
                src={post.author.img}
                alt={post.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              {/* Stack author name and date vertically */}
              <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-800">{post.author.name}</span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
            </div>
            <div className={`flex gap-2 text-gray-400  `}>
              <span 
              onClick={(e) => {
                e.stopPropagation()
                if(post._id) onLike(post._id)
              }} 
              className="flex gap-1"> <Heart fill={post.like.isliked ? "red" : "none"} size={18} /> {post.like.count} </span>
              <span className="flex gap-1"> <MessageCircleCode size={18} /> 59 </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
