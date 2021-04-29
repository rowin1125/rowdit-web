import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        aria-label="Updoot post"
        icon={<ChevronUpIcon />}
        type="button"
        isLoading={loadingState === "updoot-loading"}
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        size="sm"
      />
      {post.points}
      <IconButton
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        aria-label="Downdoot post"
        isLoading={loadingState === "downdoot-loading"}
        icon={<ChevronDownIcon />}
        type="button"
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        size="sm"
      />
    </Flex>
  );
};

export default UpdootSection;
