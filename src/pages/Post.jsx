import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import { Prism as Code } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button, Card } from "@/components/ui/index";
import ScrollProgress from "../components/ui/scroll-progress";
import SideInfoBar from "@/components/SideInfoBar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Post() {
  const [post, setPost] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then(
        (post) => {
          if (post) {
            setPost(post);
            setLikes(post.likes);
            setLiked(post.likes.includes(userData?.$id));
          } else {
            navigate("/");
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );
    } else {
      navigate("/");
    }
  }, [slug, navigate, userData]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  const renderCodeBlock = ({ inline, className, children }) => {
    const language = className ? className.replace("language-", "") : "javascript";
    return !inline ? (
      <ScrollArea  className=" whitespace-nowrap rounded-md border">
         <Code
        language={language}
        style={nightOwl}
        customStyle={{
          margin: ' 0px',
          borderRadius: '0.5rem',
          backgroundColor: 'black',
          overflow: 'auto',
        }}
        wrapLongLines={true}
        
      >
        {String(children).trim()}
      </Code>
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
     
    ) : (
      <code className={className}>{children}</code>
    );
  };

  const markdownElements = {
    code: renderCodeBlock,
    h1: ({ children }) => <h1 className="text-5xl">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
    p: ({ children }) => <p className="text-lg font-poppins font-light tracking-wide mb-4">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-500 hover:underline">{children}</a>
    ),
    strong: ({ children }) => <strong className="text-xl font-bold">{children}</strong>
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error loading post: {error.message}</div>;

  return post ? (
    <div className="mb-8">
      <ScrollProgress className="top-[68px]" />
      <div className="w-[80vw] max-lg:w-full mx-auto grid grid-cols-12 gap-5 ">
        <SideInfoBar
          isLiked={liked}
          likes={likes}
          slug={slug}
          className="sticky bottom-0 -inset-0 z-10"
          onLikeUpdate={(updatedLikes, userLiked) => {
            setLikes(updatedLikes);
            setLiked(userLiked);
          }}
        />

        <Card className="bg-white/5 col-span-12 md:col-span-8">
          <Container>
            <div className="w-full flex justify-center relative rounded-t-xl">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-t-xl object-contain"
              />

              {isAuthor && (
                <div className="absolute right-6 top-6">
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button className="mr-3">Edit</Button>
                  </Link>
                  <Button onClick={deletePost}>Delete</Button>
                </div>
              )}
            </div>
            <div className="mx-6">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <div className="text-current list-disc">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownElements}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </Container>
        </Card>

        <Card className="col-span-12 md:col-span-3">
          {/* Additional content can go here */}
        </Card>
      </div>
    </div>
  ) : null;
}
