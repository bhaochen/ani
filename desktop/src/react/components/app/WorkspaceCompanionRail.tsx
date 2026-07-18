import { useStore } from '../../stores';
import { RegionalErrorBoundary } from '../RegionalErrorBoundary';
import { RightWorkspacePanel } from '../right-workspace/RightWorkspacePanel';
import { WorkspaceFileChangeBridge } from './WorkspaceFileChangeBridge';
import { CompanionModeRail } from './CompanionModeRail';

export function WorkspaceCompanionRail() {
  const jianOpen = useStore(s => s.jianOpen);
  const currentTab = useStore(s => s.currentTab);
  const isCompanion = currentTab === 'companion';

  return (
    <>
      <WorkspaceFileChangeBridge />
      <aside className={`jian-sidebar${jianOpen ? '' : ' collapsed'}`} id="jianSidebar">
        <div className="resize-handle resize-handle-left" id="jianResizeHandle"></div>
        <div className="jian-sidebar-inner">
          {isCompanion ? (
            <RegionalErrorBoundary region="companion-mode">
              <CompanionModeRail />
            </RegionalErrorBoundary>
          ) : (
            <RegionalErrorBoundary region="right-workspace">
              <RightWorkspacePanel />
            </RegionalErrorBoundary>
          )}
        </div>
      </aside>
    </>
  );
}
