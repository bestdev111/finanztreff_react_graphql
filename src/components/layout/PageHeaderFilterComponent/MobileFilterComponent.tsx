import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {useContext, useCallback, ReactNode} from "react";
import { Card } from "react-bootstrap";

export function MobileFilterComponent({children, filtersCount}: MobileFilterComponentProps) {
    let context = useContext(PageHeaderFilterContext);
    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);
    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={"Filters"}
            description={
                <div className="d-flex">
                    <SvgImage icon="icon_filter_white.svg" convert={false} width="34" /><div className="ml-2">
                    <div className="1fs-15px font-weight-bold">Filters</div>
                    <div>{filtersCount} aktiv</div></div>
                </div>}>
            <Card className={classNames("options-filter-button px-3 pt-1 border-0")}>
                <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between d-none d-xl-flex d-sm-none d-md-none d-lg-none">
                    <h6 className="font-weight-bold pt-2">Filters</h6>
                    <span className="close-modal-butt svg-icon mt-1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                    </span>
                </Card.Header>
                <Card.Body className="mx-auto px-0">
                    {children}
                </Card.Body>
            </Card>
        </PageHeaderFilterComponent>
    );
}


interface MobileFilterComponentProps {
    children: ReactNode;
    filtersCount: number;
}
