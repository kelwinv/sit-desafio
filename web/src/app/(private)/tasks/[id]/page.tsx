interface TaskDetailsPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  return <h1>{params.id}</h1>;
}
