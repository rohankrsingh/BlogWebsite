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
import { Button } from "../components/ui/index";
import { Card, Image } from "@heroui/react";
import ScrollProgress from "../components/ui/scroll-progress";
import SideInfoBar from "../components/SideInfoBar";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import Tags from "../components/ui/Tags";
import { motion } from 'framer-motion';
import Loader from "@/components/Loader";

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
      <ScrollArea className=" whitespace-nowrap rounded-md border">
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
    h1: ({ children }) => <h1 className="text-3xl">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
    p: ({ children }) => <p className="text-lg  font-light tracking-wide mb-4">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-500 hover:underline">{children}</a>
    ),
    img: ({ src, alt, children }) => (<Image src={src} alt={alt} className="rounded-small z-0">{children}</Image>),
    strong: ({ children }) => <strong className="text-xl font-bold">{children}</strong>
  };

  if (loading) return <div className="text-center"><Loader/></div>;
  if (error) return <div className="text-red-500">Error loading post: {error.message}</div>;

  return post ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-4 font-poppins">
        <ScrollProgress className="top-[52px] max-md:top-[56px] z-30" />
        <div className="max-w-[1300px] px-2 max-lg:w-full mx-auto grid grid-cols-12 gap-5 max-md:px-0">
          <SideInfoBar
            isLiked={liked}
            likes={likes}
            slug={slug}
            className="max-md:fixed h-min left-0 bottom-0 max-md:z-30"
            onLikeUpdate={(updatedLikes, userLiked) => {
              setLikes(updatedLikes);
              setLiked(userLiked);
            }}
          />

          <Card className="col-span-12 md:col-span-8 max-md:rounded-none max-md:bg-card">
            <Container>
              <div className="w-full flex justify-center relative rounded-t-xl max-md:rounded-t-none">
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  className="rounded-t-xl object-contain max-md:rounded-t-none"
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
              <div className="mx-10 space-y-4 max-md:mx-2">
                <h1 className="text-4xl mt-8 font-semibold">{post.title}</h1>
                <div className="flex space-x-4"><Tags tags={post.tags} className={'px-0'} /></div>
                <div className="list-disc">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownElements}
                    className="space-y-5 mb-10"
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
    </motion.div>
  ) : null;
}
