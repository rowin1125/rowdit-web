import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditOrDeletePostProps {
  id: number;
  creatorId: number;
}
const EditOrDeletePost: React.FC<EditOrDeletePostProps> = ({
  id,
  creatorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data: me } = useMeQuery();

  return (
    <>
      {creatorId === me?.me?.id && (
        <Box>
          <NextLink href={`/post/edit/${id}`}>
            <IconButton
              as={Link}
              mr={2}
              colorScheme="orange"
              color="white"
              icon={<EditIcon />}
              aria-label="Edit post"
            />
          </NextLink>
          <IconButton
            colorScheme="red"
            color="white"
            aria-label="Delete post"
            icon={<DeleteIcon />}
            onClick={() =>
              deletePost({
                variables: { id },
                update: (cache) => {
                  cache.evict({ id: "Post:" + id });
                },
              })
            }
          />
        </Box>
      )}
    </>
  );
};

export default EditOrDeletePost;
