import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Tabs } from "antd";
import moment from "moment";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ContentCard,
  ContentPage,
  ContentTitle,
} from "src/_shared/components/Content";
import { MONTH_FORMAT } from "src/_shared/constants";
import { useCompetitionByIdQuery } from "src/_shared/queries";
import Leaderboard from "./Leaderboard";
import NewCompetitionModal from "./NewCompetitionModal";
import SearchForm from "./SearchForm";
import { TabActionsContext } from "./TabActionsContext";
import s from "./s.module.scss";
import QuerySubmissionModal from "./QuerySubmissionModal";
import ParticipantsSearchForm from "./ParticipantsSearchForm";
import Submissions from "./Submissions";

const CompetitionPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams] = useSearchParams();
  const [isNewCompetitionModalOpen, setIsNewCompetitionModalOpen] =
    React.useState(false);
  const [isQuerySubmissionModalOpen, setIsQuerySubmissionModalOpen] =
    React.useState(false);
  const [tabActions, setTabActions] = React.useState<React.ReactNode>(null);

  // useMemoOne
  const currentMonth = moment().startOf("month");
  // get from query params
  const month = searchParams.get("month") ?? currentMonth.format(MONTH_FORMAT);
  // useMemoOne
  const monthMoment = moment(month);
  const competitionId = searchParams.get("competition_id")
    ? Number(searchParams.get("competition_id"))
    : undefined;
  console.log("COmpetition Id");
  console.log(competitionId);
  const participantId = searchParams.get("participant_id") ?? undefined;
  console.log("Participant Id");
  console.log(participantId);
  const tab = searchParams.get("tab") ?? "leaderboard";

  const { data: competitionData } = useCompetitionByIdQuery(competitionId);

  const competition = competitionData ?? undefined;
  console.log(competition);

  // const competition = data?.competition;
  // const participants = data?.competition?.participants ?? [];
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setTabActions(null);
    navigate(
      `${location.pathname}?tab=${tab}&competition_id=${competitionId}&participant_id=${participantId}`
    );
  };

  function handleMonthChange(month: moment.Moment) {
    if (!month.isSame(monthMoment, "month")) {
      navigate(
        `${location.pathname}?tab=${tab}&month=${month.format(MONTH_FORMAT)}`
      );
    }
  }

  function handleCompetitionChange(id: number) {
    if (id) {
      navigate(
        `${location.pathname}?tab=${tab}&month=${monthMoment.format(
          MONTH_FORMAT
        )}&competition_id=${id}`
      );
    }
  }

  function handleParticipantChange(id: string) {
    console.log(id);
    if (id) {
      navigate(
        `${location.pathname}?tab=${tab}&month=${monthMoment.format(
          MONTH_FORMAT
        )}&competition_id=${competitionId}&participant_id=${id}`
      );
    }
  }

  return (
    <>
      <ContentPage>
        <ContentTitle className={s.contentTitle}>
          Competition{" "}
          <SearchForm
            month={monthMoment}
            onMonthChange={handleMonthChange}
            onCompetitionChange={handleCompetitionChange}
            competitionId={competition?.id}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ float: "right" }}
            onClick={() => setIsNewCompetitionModalOpen(true)}
          >
            New Competition
          </Button>
        </ContentTitle>
        {competition ? (
          <>
            <ContentCard>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {competition.name}
                <ParticipantsSearchForm
                  onParticipantChange={handleParticipantChange}
                  competitionId={competitionId}
                  participantId={participantId}
                />
                <Button
                  className={s.submitQueryButton}
                  type="primary"
                  onClick={() => setIsQuerySubmissionModalOpen(true)}
                  icon={<CloudUploadOutlined />}
                >
                  Submit Query
                </Button>
              </div>
              {competition.description}
            </ContentCard>

            <ContentCard>
              <TabActionsContext.Provider value={setTabActions}>
                <Tabs
                  onChange={handleTabChange}
                  activeKey={tab}
                  size="large"
                  tabBarExtraContent={tabActions}
                >
                  <Tabs.TabPane tab="Leaderboard" key="leaderboard">
                    <Leaderboard />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Submissions" key="submissions">
                    <Submissions />
                  </Tabs.TabPane>
                </Tabs>
              </TabActionsContext.Provider>
            </ContentCard>
          </>
        ) : (
          <ContentCard>
            <Empty></Empty>
          </ContentCard>
        )}
        {competition && (
          <QuerySubmissionModal
            isOpen={isQuerySubmissionModalOpen}
            onClose={() => setIsQuerySubmissionModalOpen(false)}
            competitionId={competition?.id}
          />
        )}
        <NewCompetitionModal
          isOpen={isNewCompetitionModalOpen}
          onClose={() => setIsNewCompetitionModalOpen(false)}
          month={moment()}
        />
      </ContentPage>
    </>
  );
};

export default CompetitionPage;
